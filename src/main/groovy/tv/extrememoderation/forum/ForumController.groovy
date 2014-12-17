package tv.extrememoderation.forum

import static org.springframework.web.bind.annotation.RequestMethod.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Created by Steve on 12/16/2014.
 */
@RestController
@RequestMapping('/forums')
class ForumController {

    @Autowired
    ForumRepository forumRepository

    @Autowired
    MessageRepository messageRepository

    @Autowired
    ThreadRepository threadRepository

    @RequestMapping
    List<Forum> listForums() {
        forumRepository.findAll()
    }

    @RequestMapping(value = '/', method = POST)
    Forum createForum(@RequestBody String name) {
        forumRepository.save(new Forum(name: name))
    }

    @RequestMapping('/{forumId}')
    Forum getForum(@PathVariable String forumId) {
        forumRepository.findOne(forumId)
    }

    @RequestMapping(value = '/{forumId}', method = PUT)
    Forum updateForum(@PathVariable String forumId, @RequestBody String name) {
        Forum forum = getForum(forumId)
        forum.name = name
        forumRepository.save(forum)
    }

    @RequestMapping('/{forumId}/threads')
    List<Thread> listThreadsForForum(@PathVariable String forumId) {
        threadRepository.findAllByForumId forumId
    }

    @RequestMapping(value = '/{forumId}/threads', method = POST)
    Thread createThreadForForum(@PathVariable String forumId, @RequestBody String title) {
        threadRepository.save(new Thread(title: title, forumId: forumId))
    }

    @RequestMapping(value = '/{forumId}/threads/{threadId}', method = PUT)
    Thread updateThreadForForum(
            @PathVariable String forumId,
            @PathVariable String threadId,
            @RequestBody String title
    ) {
        Thread thread = threadRepository.findOne threadId
        thread.forumId = forumId
        thread.title = title
        threadRepository.save thread
    }

    @RequestMapping('/{forumId}/threads/{threadId}')
    Thread getThread(@PathVariable String threadId) {
        threadRepository.findOne threadId
    }

    @RequestMapping('/{forumId}/threads/{threadId}/messages')
    List<Message> listMessagesForThread(@PathVariable String threadId) {
        messageRepository.findAllByThreadId threadId
    }

    @RequestMapping(value = '/{forumId}/threads/{threadId}/messages', method = POST)
    Message createMessage(
            @PathVariable String threadId,
            @RequestBody String authorId,
            @RequestBody String body
    ) {
        messageRepository.save(new Message(threadId: threadId, authorId: authorId, body: body))
    }

    @RequestMapping(value = '/{forumId}/threads/{threadId}/messages/{messageId}', method = PUT)
    Message updateMessage(
            @PathVariable String messageId,
            @RequestBody String body
    ) {
        Message message = messageRepository.findOne messageId
        message.body = body
        messageRepository.save message
    }
}
