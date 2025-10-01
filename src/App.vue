<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { provide } from 'vue';
provide('mediaUrl', 'http://127.0.0.1:8888/');
provide('socketUrl', 'ws://localhost:8000/ws/');
</script>
