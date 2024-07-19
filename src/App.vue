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
<!-- Commit 6: 2024-07-12T16:59:16 -->
<!-- Commit 9: 2024-07-19T17:39:26 -->
