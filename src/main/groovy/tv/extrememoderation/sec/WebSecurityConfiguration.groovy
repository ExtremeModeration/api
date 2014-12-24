package tv.extrememoderation.sec

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
//import org.springframework.security.authentication.AuthenticationManager
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
//import org.springframework.security.config.annotation.web.builders.HttpSecurity
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
//import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity
//import org.springframework.security.config.http.SessionCreationPolicy

/**
 * Created by steve on 12/22/14.
 */
//@Configuration
//@EnableWebSecurity
//@EnableWebMvcSecurity
class WebSecurityConfiguration/* extends WebSecurityConfigurerAdapter*/ {

    @Autowired
    CustomUserDetailsService userDetailsService

//    void configure(AuthenticationManagerBuilder auth) {
//        auth.userDetailsService(userDetailsService)
//    }
//
//    void configure(HttpSecurity http) {
//        http.
//            csrf().disable().
//            sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).
//        and().
//            authorizeRequests().
//            anyRequest().authenticated()
//    }
//
//    @Bean
//    AuthenticationManager authenticationManagerBean() {
//        super.authenticationManagerBean()
//    }

}
