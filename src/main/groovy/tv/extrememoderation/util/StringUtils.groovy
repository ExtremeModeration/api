package tv.extrememoderation.util

/**
 * Created by steve on 12/20/14.
 */
class StringUtils {
    static String slugify( String input ) {
        String output = input.toLowerCase()
        def pattern1 = ~/[^\w ]/
        def pattern2 = ~/ +/
        def pattern3 = ~/--+/
        return output.replaceAll(pattern1, '').replaceAll(pattern2, '-').replaceAll(pattern3, '-')
    }
}
