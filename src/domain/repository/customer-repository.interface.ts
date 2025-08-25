import Customer from '../entity/customers';
import RepositoryInterface from './repository.interface';

export default interface CustomerRepositoryInterface
  extends RepositoryInterface<Customer> { }
