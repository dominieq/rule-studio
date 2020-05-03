package pl.put.poznan.rulestudio.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"pl.put.poznan.rulestudio"})
public class RuLeStudioApp {

    public static void main(String[] args)
    {
        SpringApplication.run(RuLeStudioApp.class, args);
    }
}