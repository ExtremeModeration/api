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

    @Autowired
    ForumRepository forumRepository

    @Autowired
    MessageRepository messageRepository

    @Autowired
    ThreadRepository threadRepository

    @Autowired
    UserRepository userRepository

    static void main(String[] args) {
        SpringApplication.run Application, args
    }

    void run(String... args) {
        log.info 'Application started, now bootstrapping...'

        [forumRepository, messageRepository, threadRepository, userRepository].each {
            it.deleteAll()
        }
/*
        def user = userRepository.save(new User(username: 'exmo', token: 'abc123', email: 'exmo@email.internet.com'))
        def forum = forumRepository.save(new Forum(name: 'Testing'))
        def thread = threadRepository.save(new Thread(forumId: forum.id, title: 'A Test Thread'))
        [
                'Where is the princess???',
                'In the next castle!',
                'Ok, thanks, I sure hope there is no lava there!!'
        ].each {
            messageRepository.save(new Message(body: it, authorId: user.id, threadId: thread.id))
        }*/

        log.info 'Application is ready!'
    }

}
