package tv.extrememoderation.sec

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.RequestParam

/**
 * Created by Steve on 12/15/2014.
 */
@Component
interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String username)
}
