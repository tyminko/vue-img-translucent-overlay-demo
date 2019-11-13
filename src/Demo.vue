<template>
  <div class="demo">
    <h1></h1>
    <img-with-overlay
      src="https://c.pxhere.com/photos/ae/03/forest_in_the_woods_mountain_adherent_foliage_slovakia_summer_lu_enec-509390.jpg!d"
      :o-blur="2"
      :o-fill-opacity="0.5"
      class="img-with-over">
      <div class="label">Text Text</div>
      <div class="footer">
        <expandable-text use-click>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam, libero quos cumque, quia rerum natus adipisci modi neque esse fugit est tempore! Vel repellendus voluptates voluptatum dolores sit ut officiis!
        </expandable-text>
      </div>
    </img-with-overlay>
  </div>
</template>

<script>
import ExpandableText from 'vue-expandable-text-line'
import ImgWithOverlay from './ImgTransOverlay'

export default {
  name: 'Demo',
  components: { ImgWithOverlay, ExpandableText },

  props: {
  },

  data: () => ({
  }),

  computed: {
  },

  methods: {
  }
}
</script>

<style lang='scss'>
html {
  width: 100vw;
  height: 100vh;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.demo {
  position: relative;
}
.img-with-over {
  width: 60vw;
  height: 400px;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: -70% center;
    background: red;
    transform: rotate(15deg) scale(1.5);
  }
}
.label {
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 5px 10px;
  //border: 1px solid rgba(0, 0, 0, 0.075);
  border-bottom-right-radius: 15px;
}
.footer {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 5px 10px;
  min-height: 46px;
  width: 50%;
  border-radius: 30px;
}
</style>
