package tv.extrememoderation.forum

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Component

/**
 * Created by Steve on 12/16/2014.
 */
@Component
interface ThreadMessageRepository extends MongoRepository<Forum, String> {
}