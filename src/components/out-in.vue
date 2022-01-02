<template>
    <transition name="out-in" mode="out-in">
        <slot></slot>
    </transition>
</template>

<style>
.out-in-enter-from,
.out-in-leave-to {
    opacity: 0;
}

.out-in-enter-active,
.out-in-leave-active {
    transition: opacity 0.2s;
}
</style>
