package tv.extrememoderation.sec

import org.joda.time.DateTime
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Created by Steve on 12/15/2014.
 */
@Document
class User {

    @Id
    String id
    String username
    String email
    String token

    @Version
    Long version
    @CreatedDate
    DateTime createdDate
    @LastModifiedDate
    DateTime lastModifiedDate

}
