<template>
  12
  <MdEditor v-model="text" :toolbarsExclude="toolbarsExclude"  autoFocus @onUploadImg="onUploadImg" />
</template>

<script setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import axios from 'axios';

const text = ref('');
const toolbarsExclude =[
  'save',
  'fullscreen',
  'github'
]

const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('image', file);

        axios.post(`${import.meta.env.VITE_APP_BASEURL}/api/upload`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item) => import.meta.env.VITE_APP_BASEURL + '/' + item.data.filePath));
}
</script>