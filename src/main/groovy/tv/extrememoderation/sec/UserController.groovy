package tv.extrememoderation.sec

import org.springframework.security.access.annotation.Secured

import static org.springframework.web.bind.annotation.RequestMethod.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Created by steve on 12/19/14.
 */
@RestController
@RequestMapping('/users')
class UserController {

    @Autowired
    UserRepository userRepository

    @Secured("ROLE_ADMIN")
    @RequestMapping
    List<User> listUsers() {
        userRepository.findAll()
    }

    @RequestMapping(method = POST)
    User createUser(@RequestBody User _user) {
        User user = getUserByUsername _user.username
        if (!user) {
            user = userRepository.save(_user)
        }
        user
    }

    @RequestMapping('/{username}')
    User getUserByUsername(@PathVariable String username) {
        userRepository.findByUsername username
    }

    @RequestMapping(value = '/{username}', method = PUT)
    User updateUser(@PathVariable String username, @RequestBody String email) {
        User user = getUserByUsername username
        if (!user) return null

        user.email = email
        userRepository.save user
    }

}
