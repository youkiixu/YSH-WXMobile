<template>
  <div id="preloader">
    <div id="loader"></div>
  </div>

</template>

<script>
export default {
    
}
</script>

<style scoped>
#preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
#loader {
    display: block;
    position: relative;
    left: 50%;
    top: 50%;
    width: 150rpx;
    height: 150rpx;
    margin: -75rpx 0 0 -75rpx;
    border-radius: 50%;
    border: 3px solid transparent;
    /* border-top-color: #9370DB; */
    border-top-color: rgb(199, 242, 243);
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
}
#loader:before {
    content: "";
    position: absolute;
    top: 5rpx;
    left: 5rpx;
    right: 5rpx;
    bottom: 5rpx;
    border-radius: 50%;
    border: 3px solid transparent;
    /* border-top-color: #BA55D3; */
    border-top-color: rgb(111, 217, 221);
    -webkit-animation: spin 3s linear infinite;
    animation: spin 3s linear infinite;
}
#loader:after {
    content: "";
    position: absolute;
    top: 15rpx;
    left: 15rpx;
    right: 15rpx;
    bottom: 15rpx;
    border-radius: 50%;
    border: 3px solid transparent;
    /* border-top-color: #FF00FF; */
    border-top-color: #009e96;
    -webkit-animation: spin 1.5s linear infinite;
    animation: spin 1.5s linear infinite;
}
@-webkit-keyframes spin {
    0%   {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
@keyframes spin {
    0%   {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

</style>

