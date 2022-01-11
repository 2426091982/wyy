<script lang='ts' setup>
defineProps({
    type: {
        type: String,
        required: true,
    },
    size: {
        type: [Number, String],
        default: 14,
    },
});
</script>

<template>
    <span>
        <svg class="icon" aria-hidden="true" :style="{fontSize: `${size}px`}">
            <use :xlink:href="`#${type}`"></use>
        </svg>
    </span>
</template>

<style lang='less'>

</style>
