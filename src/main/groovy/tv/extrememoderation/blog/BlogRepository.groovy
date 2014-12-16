package tv.extrememoderation.blog

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Component

/**
 * Created by Steve on 12/16/2014.
 */
@Component
interface BlogRepository extends MongoRepository<Blog, String> {
}