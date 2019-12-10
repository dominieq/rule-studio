package pl.put.poznan.rulework.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"pl.put.poznan.rulework.rest"})
public class RuleWorkApp {

    public static void main(String[] args)
    {
        SpringApplication.run(RuleWorkApp.class, args);
    }
}