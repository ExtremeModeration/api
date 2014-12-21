package tv.extrememoderation.blog

import org.joda.time.DateTime
import org.springframework.web.bind.annotation.RequestBody

import static org.springframework.web.bind.annotation.RequestMethod.*

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Created by steve on 12/20/14.
 */
@RestController
@RequestMapping('/blogs')
class BlogController {

    @Autowired
    BlogRepository blogRepository

    @RequestMapping
    Page<Blog> listBlogs(Pageable pageable) {
        blogRepository.findAll pageable
    }

    @RequestMapping(method = POST)
    Blog createBlog(@RequestBody Blog blog) {
        blog.generateSlug()
        if (blogRepository.findOne(blog.slug)) {
            blog.slug += "-${new Date().time}"
        }

        blogRepository.save blog
    }

    @RequestMapping('/{slug}')
    Blog getBlog(@PathVariable String slug) {
        blogRepository.findOne slug
    }

    @RequestMapping(value = '/{slug}', method = PUT)
    Blog updateBlog(@PathVariable String slug, @RequestBody Blog blog) {
        Blog _blog = blogRepository.findOne slug
        if (!_blog) {
            _blog = createBlog(blog)
        } else {
            boolean replacesOld = blog.title.toLowerCase() != _blog.title.toLowerCase()
            DateTime _createdAt = _blog.createdAt
            if (replacesOld) {
                blog.comments = _blog.comments
                blogRepository.delete slug
                _blog = blog
            }

            _blog.title = blog.title
            _blog.authorName = blog.authorName
            _blog.body = blog.body
            _blog.generateSlug()
            if (blogRepository.findOne(_blog.slug)) {
                _blog.slug += "-${new Date().time}"
            }

            _blog = blogRepository.save _blog

            if (replacesOld) {
                _blog.createdAt = _createdAt
                _blog = blogRepository.save _blog
            }
        }
        _blog
    }

}
