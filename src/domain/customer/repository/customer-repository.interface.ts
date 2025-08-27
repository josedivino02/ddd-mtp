import Customer from '../entity/customers';
import RepositoryInterface from '../../@shared/repository/repository.interface';

export default interface CustomerRepositoryInterface
  extends RepositoryInterface<Customer> { }
