<template>
  <div className="container">
    <header className="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>
</template>

<script>
import UserService from '../services/user-service'
import EventBus from '../common/EventBus'

export default {
  name: 'BoardAdmin',
  data () {
    return {
      content: '',
    }
  },
  mounted () {
    UserService.getAdminBoard().then(
        (response) => {
          this.content = response.data
        },
        (error) => {
          this.content =
              (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
              error.message ||
              error.toString()

          if (error.response && error.response.status === 403) {
            EventBus.dispatch('logout')
          }
        }
    )
  },
}
</script>
