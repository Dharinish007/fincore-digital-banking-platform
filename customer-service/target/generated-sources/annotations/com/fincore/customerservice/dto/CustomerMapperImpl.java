package com.fincore.customerservice.dto;

import com.fincore.customerservice.entity.Customer;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-04T18:37:38+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Oracle Corporation)"
)
@Component
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public CustomerResponse toResponse(Customer customer) {
        if ( customer == null ) {
            return null;
        }

        CustomerResponse.CustomerResponseBuilder customerResponse = CustomerResponse.builder();

        customerResponse.id( customer.getId() );
        customerResponse.customerNumber( customer.getCustomerNumber() );
        customerResponse.firstName( customer.getFirstName() );
        customerResponse.lastName( customer.getLastName() );
        customerResponse.email( customer.getEmail() );
        customerResponse.phoneNumber( customer.getPhoneNumber() );
        customerResponse.dateOfBirth( customer.getDateOfBirth() );
        customerResponse.address( customer.getAddress() );
        customerResponse.city( customer.getCity() );
        customerResponse.state( customer.getState() );
        customerResponse.postalCode( customer.getPostalCode() );
        customerResponse.country( customer.getCountry() );
        customerResponse.kycStatus( customer.getKycStatus() );
        customerResponse.riskLevel( customer.getRiskLevel() );
        customerResponse.status( customer.getStatus() );
        customerResponse.createdAt( customer.getCreatedAt() );
        customerResponse.updatedAt( customer.getUpdatedAt() );

        return customerResponse.build();
    }

    @Override
    public Customer toEntity(CustomerRequest request) {
        if ( request == null ) {
            return null;
        }

        Customer.CustomerBuilder customer = Customer.builder();

        customer.firstName( request.getFirstName() );
        customer.lastName( request.getLastName() );
        customer.email( request.getEmail() );
        customer.phoneNumber( request.getPhoneNumber() );
        customer.dateOfBirth( request.getDateOfBirth() );
        customer.address( request.getAddress() );
        customer.city( request.getCity() );
        customer.state( request.getState() );
        customer.postalCode( request.getPostalCode() );
        customer.country( request.getCountry() );

        return customer.build();
    }

    @Override
    public void updateEntityFromRequest(CustomerRequest request, Customer customer) {
        if ( request == null ) {
            return;
        }

        if ( request.getFirstName() != null ) {
            customer.setFirstName( request.getFirstName() );
        }
        if ( request.getLastName() != null ) {
            customer.setLastName( request.getLastName() );
        }
        if ( request.getEmail() != null ) {
            customer.setEmail( request.getEmail() );
        }
        if ( request.getPhoneNumber() != null ) {
            customer.setPhoneNumber( request.getPhoneNumber() );
        }
        if ( request.getDateOfBirth() != null ) {
            customer.setDateOfBirth( request.getDateOfBirth() );
        }
        if ( request.getAddress() != null ) {
            customer.setAddress( request.getAddress() );
        }
        if ( request.getCity() != null ) {
            customer.setCity( request.getCity() );
        }
        if ( request.getState() != null ) {
            customer.setState( request.getState() );
        }
        if ( request.getPostalCode() != null ) {
            customer.setPostalCode( request.getPostalCode() );
        }
        if ( request.getCountry() != null ) {
            customer.setCountry( request.getCountry() );
        }
    }
}
