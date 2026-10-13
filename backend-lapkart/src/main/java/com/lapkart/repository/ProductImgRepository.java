package com.lapkart.repository;

import com.lapkart.entity.ProductImg;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductImgRepository extends JpaRepository<ProductImg, Long> {
    List<ProductImg> findByProductId(Long productId);
}
