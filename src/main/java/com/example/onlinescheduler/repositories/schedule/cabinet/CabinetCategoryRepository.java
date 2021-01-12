package com.example.onlinescheduler.repositories.schedule.cabinet;

import com.example.onlinescheduler.models.schedule.cabinet.CabinetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CabinetCategoryRepository extends JpaRepository<CabinetCategory, Long> {
}
