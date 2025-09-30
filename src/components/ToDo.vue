<template>
    <div
        class="relative min-h-screen lg:flex bg-gradient-to-br from-blue-50 to-indigo-100"
    >
        <SidebarMenu />

        <main
            id="content"
            class="flex-1 pb-12 space-y-6 overflow-y-auto bg-transparent lg:h-screen md:space-y-8"
        >
            <Header />

            <section
                class="flex flex-col w-full px-6 md:justify-between md:items-center md:flex-row"
            >
                <div>
                    <h2
                        class="text-3xl font-bold text-indigo-800 drop-shadow-sm"
                    >
                        {{ t('todos.title') }}
                    </h2>
                    <p class="mt-2 text-sm text-indigo-600">
                        {{ t('todos.description') }}
                    </p>
                </div>
            </section>

            <!-- To-Do List Section -->
            <section
                class="w-full mx-auto bg-white/90 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-6 backdrop-blur-md px-6"
                style="max-width: 90%"
            >
                <div
                    class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4"
                >
                    <h3
                        class="text-xl font-bold text-indigo-700 flex items-center gap-2"
                    >
                        <svg
                            class="w-6 h-6 text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2l4 -4"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                        </svg>
                        {{ t('todos.title') || 'To-Do List' }}
                    </h3>
                    <div
                        class="flex flex-col items-end space-y-1 sm:items-end sm:w-auto w-full"
                    >
                        <button
                            @click="syncOrBackupToDoList"
                            class="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 font-semibold transition w-full sm:w-auto"
                            :disabled="isSyncing"
                        >
                            <span
                                v-if="!isSyncing"
                                class="flex items-center gap-1 justify-center"
                            >
                                <!-- Sync & Backup Icon -->
                                <svg
                                    class="w-4 h-4 mr-1 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-6.219-8.56M16 16l2 2m0 0l2-2m-2 2V12"
                                    />
                                </svg>
                                {{
                                    t('todos.sync') ||
                                    'Sync & Backup To-Do List'
                                }}
                            </span>
                            <span
                                v-else
                                class="flex items-center gap-1 justify-center"
                            >
                                <svg
                                    class="w-4 h-4 mr-1 animate-spin text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    ></path>
                                </svg>
                                {{ t('todos.syncing') || 'Syncing...' }}
                            </span>
                        </button>

                        <div
                            class="text-xs text-gray-500 text-right w-full sm:w-auto"
                        >
                            {{
                                t('todos.syncDescription') ||
                                'Sync your to-do list across devices using localStorage. Note: Clearing browser data will remove saved tasks.'
                            }}
                        </div>
                    </div>
                </div>
                <form @submit.prevent="addTodo" class="flex gap-2">
                    <input
                        v-model="newTodo"
                        type="text"
                        class="flex-1 border border-indigo-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                        :placeholder="t('todos.addTodo') || 'Add a new task...'"
                    />
                    <button
                        type="submit"
                        class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
                    >
                        +
                    </button>
                </form>
                <ul class="space-y-2">
                    <li
                        v-for="(todo, idx) in todos"
                        :key="todo.id"
                        class="flex items-center justify-between bg-indigo-50 rounded-lg px-4 py-2 shadow-sm group"
                    >
                        <div class="flex items-center gap-2">
                            <input
                                type="checkbox"
                                v-model="todo.done"
                                @change="saveTodos"
                                class="accent-indigo-600"
                            />
                            <span
                                :class="{
                                    'line-through text-gray-400': todo.done,
                                }"
                            >
                                {{ todo.text }}
                            </span>
                        </div>
                        <button
                            @click="removeTodo(idx)"
                            class="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </li>
                    <li
                        v-if="todos.length === 0"
                        class="text-gray-400 text-center"
                    >
                        {{ t('todos.noTodos') || 'No tasks yet!' }}
                    </li>
                </ul>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Header from './layout/Header.vue';
import SidebarMenu from './layout/SidebarMenu.vue';
import { useI18n } from 'vue-i18n';
import api from '../api'; // Adjust the path as necessary
const { t } = useI18n();

// To-Do List State
const todos = ref([]);
const newTodo = ref('');

// Load todos from localStorage on mount
onMounted(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos.value = JSON.parse(savedTodos);
    }
});

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos.value));
}

// Add a new todo
function addTodo() {
    const text = newTodo.value && newTodo.value.trim();
    if (!text) return;
    todos.value.push({
        id: Date.now(),
        text,
        done: false,
    });
    newTodo.value = '';
    saveTodos();
}

// Remove a todo by index
function removeTodo(idx) {
    todos.value.splice(idx, 1);
    saveTodos();
}
const isSyncing = ref(false);

async function syncOrBackupToDoList() {
    if (isSyncing.value) return;
    isSyncing.value = true;
    try {
        const BATCH_SIZE = 100;
        const todosData = todos.value;
        if (!todosData || todosData.length === 0) {
        } else {
            if (todosData.length <= BATCH_SIZE) {
                await api.post('/sync-todo-list/', {
                    todos_data: JSON.stringify(todosData),
                });
            } else {
                // Batch upload for very large arrays
                const batches = chunkArray(todosData, BATCH_SIZE);
                for (const batch of batches) {
                    await api.post('/sync-todo-list/', {
                        todos_data: JSON.stringify(batch),
                    });
                }
            }
        }

        const response = await api.get('/get-synced-todo-list/');
        if (response && response.data && response.data.todos) {
            const serverTodos =
                typeof response.data.todos === 'string'
                    ? JSON.parse(response.data.todos)
                    : response.data.todos;

            const merged = [];
            const seen = new Set();
            for (const todo of [...serverTodos, ...todos.value]) {
                if (!seen.has(todo.id)) {
                    merged.push(todo);
                    seen.add(todo.id);
                }
            }
            todos.value = merged;
            localStorage.setItem('todos', JSON.stringify(merged));
        }
    } catch (error) {
        console.error('Error syncing todos:', error);
    } finally {
        isSyncing.value = false;
    }
}

function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
</script>
