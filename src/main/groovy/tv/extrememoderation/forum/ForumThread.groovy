package tv.extrememoderation.forum

import org.joda.time.DateTime
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Created by Steve on 12/16/2014.
 */
@Document
class ForumThread {

    @Id
    String id
    String title
    String forumId

    @Version
    Long version
    @CreatedDate
    DateTime createdAt
    @LastModifiedDate
    DateTime lastModified
}
