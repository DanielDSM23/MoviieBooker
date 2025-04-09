import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation as ReservationEntity } from '../typeorm/Reservation';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

const mockReservationRepo = () => ({
  findBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
});

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: jest.Mocked<Repository<ReservationEntity>>;

  const mockUser = { id: 1 };
  const mockReq = { user: mockUser };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        JwtService,
        {
          provide: getRepositoryToken(ReservationEntity),
          useFactory: mockReservationRepo,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get(getRepositoryToken(ReservationEntity));
  });

  describe('createReservation', () => {
    const dto = {
      reservationDate: '2025-04-09T20:13:12.000Z',
    };

    it('should create and save a reservation if no conflict exists', async () => {
      reservationRepository.findBy.mockResolvedValue([]);
      reservationRepository.create.mockReturnValue({ ...dto });
      reservationRepository.save.mockResolvedValue({
        id: 1,
        reservationDate: dto.reservationDate,
        user: mockUser.id,
      });

      const result = await service.createReservation(dto, mockReq);

      expect(reservationRepository.findBy).toHaveBeenCalled();
      expect(reservationRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: 1,
        reservationDate: dto.reservationDate,
        user: mockUser.id,
      });
    });

    it('should throw ConflictException if overlapping reservation exists', async () => {
      reservationRepository.findBy.mockResolvedValue([{}]); // simulate conflict

      await expect(service.createReservation(dto, mockReq)).rejects.toThrow(ConflictException);
    });
  });

  describe('getAllUserReservation', () => {
    it('should return all reservations without user field', async () => {
      reservationRepository.findBy.mockResolvedValue([
        { id: 1, reservationDate: 'date', user: { id: mockUser.id } },
      ]);

      const result = await service.getAllUserReservation(mockReq);
      expect(result).toEqual([{ id: 1, reservationDate: 'date' }]);
    });
  });

  describe('deleteReservation', () => {
    it('should delete reservation successfully', async () => {
      reservationRepository.findOneBy.mockResolvedValue({ id: 1, user: { id: mockUser.id } });
      reservationRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteReservation(mockReq, 1);
      expect(result).toEqual({ message: 'Reservation with ID 1 has been deleted' });
    });

    it('should throw UnauthorizedException if user is not owner', async () => {
      reservationRepository.findOneBy.mockResolvedValue({ id: 1, user: { id: 999 } });

      await expect(service.deleteReservation(mockReq, 1)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if nothing was deleted', async () => {
      reservationRepository.findOneBy.mockResolvedValue({ id: 1, user: { id: mockUser.id } });
      reservationRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteReservation(mockReq, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
