package com.taskmanagementsystem.service;

import com.taskmanagementsystem.entity.Task;
import com.taskmanagementsystem.entity.TaskStatus;
import com.taskmanagementsystem.entity.User;
import com.taskmanagementsystem.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasksByUser(User user) {
        return taskRepository.findByCreatedByIdOrderByCreatedOnDesc(user.getId());
    }

    public Optional<Task> getTaskById(Long taskId, User user) {
        return taskRepository.findByIdAndCreatedById(taskId, user.getId());
    }

    public Task createTask(Task task, User user) {
        task.setCreatedBy(user);
        task.setLastUpdatedBy(user);
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Task updatedTask, User user) {
        Optional<Task> existingTask = taskRepository.findByIdAndCreatedById(taskId, user.getId());

        if (existingTask.isPresent()) {
            Task task = existingTask.get();
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setDueDate(updatedTask.getDueDate());
            task.setStatus(updatedTask.getStatus());
            task.setRemarks(updatedTask.getRemarks());
            task.setLastUpdatedBy(user);

            return taskRepository.save(task);
        }

        throw new RuntimeException("Task not found or access denied");
    }

    public boolean deleteTask(Long taskId, User user) {
        Optional<Task> task = taskRepository.findByIdAndCreatedById(taskId, user.getId());

        if (task.isPresent()) {
            taskRepository.delete(task.get());
            return true;
        }

        return false;
    }

    public List<Task> searchTasks(String keyword, User user) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllTasksByUser(user);
        }
        return taskRepository.searchTasksByKeyword(user.getId(), keyword.trim());
    }

    public List<Task> getTasksByStatus(TaskStatus status, User user) {
        return taskRepository.findByCreatedByIdAndStatus(user.getId(), status);
    }

    public List<Task> getTasksByDateRange(LocalDate startDate, LocalDate endDate, User user) {
        return taskRepository.findByCreatedByIdAndDueDateBetween(user.getId(), startDate, endDate);
    }
}
