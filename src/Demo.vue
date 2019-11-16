<template>
  <div class="demo">
    <h1></h1>
    <img-w-overlay
      src="https://c.pxhere.com/photos/ae/03/forest_in_the_woods_mountain_adherent_foliage_slovakia_summer_lu_enec-509390.jpg!d"
      :o-blur="10"
      :o-fill-opacity="0.5"
      class="img-with-over">
      <div class="label">Text Text</div>
      <div class="footer">
        <div class="expand-wrap io-scrollable">
          <expandable-text use-click>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam, libero quos cumque, quia rerum natus adipisci modi neque esse fugit est tempore! Vel repellendus voluptates voluptatum dolores sit ut officiis!
            Animi, ab accusantium, eos repellendus ducimus ad rem numquam, expedita incidunt temporibus asperiores! Rerum culpa assumenda sunt quis praesentium inventore asperiores labore!
            Beatae enim commodi sed necessitatibus excepturi ut temporibus voluptates quasi laudantium blanditiis, quidem, dicta reprehenderit ea laborum laboriosam, autem possimus quia aliquam.
          </expandable-text>
        </div>
      </div>
      <button>AAA</button>
    </img-w-overlay>
  </div>
</template>

<script>
import ExpandableText from './ExpandableTextLine'
import ImgWOverlay from './ImgTransOverlay'

export default {
  name: 'Demo',
  components: { ImgWOverlay, ExpandableText },

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
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
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
    object-position: 0% center;
    background: rgb(136, 136, 136);
    // transform: rotate(15deg) scale(1.5);
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
  width: 50%;
  max-height: calc(100% - 40px);
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 10px;
}
.expand-wrap {
  padding: 5px 10px;
  max-height: 300px;
  overflow: auto;
}
button {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
