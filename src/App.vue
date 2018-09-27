<script>
import { mapActions } from 'vuex'
export default {
  mpType: 'app',
  mounted () {
    this.sassLogin()
  },
  methods: {
    ...mapActions([
      // 'getIndexData',
      'sassLogin'
    ])
  }
}
</script>

<style>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
