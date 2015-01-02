package tv.extrememoderation.sec

import org.springframework.security.core.GrantedAuthority

/**
 * Created by steve on 12/22/14.
 */
class Role implements GrantedAuthority {
    String authority
}
