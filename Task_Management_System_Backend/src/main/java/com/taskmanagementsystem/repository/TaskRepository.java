package com.taskmanagementsystem.repository;

import com.taskmanagementsystem.entity.Task;
import com.taskmanagementsystem.entity.TaskStatus;
import com.taskmanagementsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByCreatedByIdOrderByCreatedOnDesc(Long userId);

    Optional<Task> findByIdAndCreatedById(Long taskId, Long userId);

    @Query("SELECT t FROM Task t WHERE t.createdBy.id = :userId AND " +
            "(LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.remarks) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Task> searchTasksByKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);

    List<Task> findByCreatedByIdAndStatus(Long userId, TaskStatus status);

    List<Task> findByCreatedByIdAndDueDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
