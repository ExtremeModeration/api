package tv.extrememoderation.blog

import org.joda.time.DateTime
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document
import tv.extrememoderation.util.StringUtils

/**
 * Created by Steve on 12/16/2014.
 */
@Document
class Blog {
    @Id
    String slug

    String title
    String body
    String authorName
    List<Comment> comments

    @Version
    Long version
    @CreatedDate
    DateTime createdAt
    @LastModifiedDate
    DateTime lastModified

    void generateSlug() {
        slug = StringUtils.slugify title
    }
}
