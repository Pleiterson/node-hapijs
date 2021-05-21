import Boom from 'boom'

class PostsController {
  constructor(Posts) {
    this.Posts = Posts;
  }

  async find(request) {
    const {id} = request.params
    const query = {}

    if (id) {
      query._id = id
    }

    try {
      const posts = await this.Posts.find(query)
      return {posts}
        
    } catch (error) {
      return Boom.badRequest('Failed to find posts')
    }
  }

  async create(request, h, err) {
    try {
      const posts = new this.Posts(request.payload)
      await posts.save()

      return h.response().code(201)
    } catch (error) {
      return Boom.badRequest(error)
    }
  }

  async update(request, h) {
    const {id} = request.params

    try {
      const updatedPosts = await this.Posts.findOneAndUpdate({_id: id}, request.payload, {
        new: true,
      });

      if (updatedPosts) {
        return h.response().code(200)
      }

      return Boom.badRequest('Could not update the posts')
    } catch (error) {
      return Boom.badRequest(error)
    }
  }

  async delete(request, h) {
    const {id} = request.params
    
    try {
      const deletePost = await this.Posts.deleteOne({_id: id})

      if (deletePost) {
        return h.response().code(200)
      }
    } catch (error) {
      return Boom.badRequest(error)
    }
  }
}

export default PostsController