export interface Car {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  driverId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarRepository {
  create(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car>;
  findById(id: string): Promise<Car | null>;
  findByDriverId(driverId: string): Promise<Car[]>;
  update(id: string, car: Partial<Car>): Promise<Car>;
  delete(id: string): Promise<void>;
} 