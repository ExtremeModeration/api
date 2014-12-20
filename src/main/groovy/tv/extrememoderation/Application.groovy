package tv.extrememoderation

import groovy.util.logging.Log
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.data.mongodb.config.EnableMongoAuditing
import tv.extrememoderation.forum.Forum
import tv.extrememoderation.forum.ForumRepository
import tv.extrememoderation.forum.Message
import tv.extrememoderation.forum.MessageRepository
import tv.extrememoderation.forum.Thread
import tv.extrememoderation.forum.ThreadRepository
import tv.extrememoderation.sec.User
import tv.extrememoderation.sec.UserRepository

/**
 * Created by Steve on 12/15/2014.
 */

@Log
@EnableMongoAuditing
@SpringBootApplication
class Application implements CommandLineRunner {

    static void main(String[] args) {
        SpringApplication.run Application, args
    }

    void run(String... args) {
        log.info 'Application started, now bootstrapping...'



        log.info 'Application is ready!'
    }

}
