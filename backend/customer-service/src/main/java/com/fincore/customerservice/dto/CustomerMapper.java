package com.fincore.customerservice.dto;

import com.fincore.customerservice.entity.Customer;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    CustomerResponse toResponse(Customer customer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerNumber", ignore = true)
    @Mapping(target = "kycStatus", ignore = true)
    @Mapping(target = "riskLevel", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Customer toEntity(CustomerRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerNumber", ignore = true)
    @Mapping(target = "kycStatus", ignore = true)
    @Mapping(target = "riskLevel", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(CustomerRequest request, @MappingTarget Customer customer);
}
