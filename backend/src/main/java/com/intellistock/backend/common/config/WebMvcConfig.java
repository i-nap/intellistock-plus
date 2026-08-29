package com.intellistock.backend.common.config;

import com.intellistock.backend.common.billing.ProGuardInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final ProGuardInterceptor proGuardInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(proGuardInterceptor)
                .addPathPatterns(
                        "/api/v1/reports/**",
                        "/api/v1/users/**");
    }
}
