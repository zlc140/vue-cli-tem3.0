<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
      <table width="100%" border="1" >
          <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
          </tr>
          <tr>
              <td>4</td>
              <td>5</td>
              <td>6</td>
          </tr>
          <tr>
              <td>7</td>
              <td>8</td>
              <td>9</td>
          </tr>
      </table>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.hello
    display: flex
    flex-direction : column
    text-align: center
    color: red
    table
        for row in 1 2 3
            tr:nth-child({row})
                font-size: 13px * row
    p
        color: blue
        text-align: center

</style>
