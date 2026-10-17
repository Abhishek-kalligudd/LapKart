# ========================================================
# Stage 1: Build the Spring Boot application with Maven
# ========================================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build executable JAR without tests
COPY src ./src
RUN mvn clean package -DskipTests

# ========================================================
# Stage 2: Lightweight production JRE runtime
# ========================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/backend-lapkart-*.jar app.jar

# Render supplies $PORT environment variable dynamically
ENV PORT=8081
EXPOSE 8081

# Optimize JVM memory usage for Render container limits (512MB free tier)
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
