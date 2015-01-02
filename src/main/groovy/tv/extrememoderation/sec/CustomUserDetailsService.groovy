package tv.extrememoderation.sec

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

/**
 * Created by steve on 12/22/14.
 */
@Service
class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository

    UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
        if (!user) {
            throw new UsernameNotFoundException("User $username does not exist")
        }
        new UserRepositoryUserDetails(user)
    }

    final static class UserRepositoryUserDetails extends User implements UserDetails {

        String password

        UserRepositoryUserDetails(User user) {
            super(user)
        }

        Collection<? extends GrantedAuthority> getAuthorities() {
            AuthorityUtils.createAuthorityList('ROLE_USER', 'ROLE_ADMIN')
        }

        boolean isAccountNonExpired() { true }
        boolean isAccountNonLocked() { true }
        boolean isCredentialsNonExpired() { true }
        boolean isEnabled() { true }
    }
}
