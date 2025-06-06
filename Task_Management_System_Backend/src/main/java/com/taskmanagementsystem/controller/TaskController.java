package com.taskmanagementsystem.controller;

import com.taskmanagementsystem.entity.Task;
import com.taskmanagementsystem.entity.TaskStatus;
import com.taskmanagementsystem.entity.User;
import com.taskmanagementsystem.service.TaskService;
import com.taskmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    private User getCurrentUser(Authentication auth) {
        return userService.findByUsername(auth.getName());
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(Authentication auth) {
        User user = getCurrentUser(auth);
        List<Task> tasks = taskService.getAllTasksByUser(user);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, Authentication auth) {
        User user = getCurrentUser(auth);
        Optional<Task> task = taskService.getTaskById(id, user);

        if (task.isPresent()) {
            return ResponseEntity.ok(task.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task, Authentication auth) {
        try {
            User user = getCurrentUser(auth);
            Task createdTask = taskService.createTask(task, user);
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task, Authentication auth) {
        try {
            User user = getCurrentUser(auth);
            Task updatedTask = taskService.updateTask(id, task, user);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication auth) {
        User user = getCurrentUser(auth);
        boolean deleted = taskService.deleteTask(id, user);

        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(
            @RequestParam(required = false) String keyword,
            Authentication auth) {
        User user = getCurrentUser(auth);
        List<Task> tasks = taskService.searchTasks(keyword, user);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(
            @PathVariable TaskStatus status,
            Authentication auth) {
        User user = getCurrentUser(auth);
        List<Task> tasks = taskService.getTasksByStatus(status, user);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Task>> getTasksByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication auth) {
        User user = getCurrentUser(auth);
        List<Task> tasks = taskService.getTasksByDateRange(startDate, endDate, user);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTaskStats(Authentication auth) {
        User user = getCurrentUser(auth);
        List<Task> allTasks = taskService.getAllTasksByUser(user);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", allTasks.size());
        stats.put("pendingTasks", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING).count());
        stats.put("inProgressTasks", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count());
        stats.put("completedTasks", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count());
        stats.put("cancelledTasks", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.CANCELLED).count());

        return ResponseEntity.ok(stats);
    }
}