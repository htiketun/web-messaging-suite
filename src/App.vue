<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { provide } from 'vue';
provide('mediaUrl', 'http://127.0.0.1:8888/');
provide('socketUrl', 'ws://127.0.0.1:6666/ws/');
</script>
