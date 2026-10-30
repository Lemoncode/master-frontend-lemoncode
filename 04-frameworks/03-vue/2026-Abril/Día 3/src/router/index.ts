import HomePage from "@/views/HomePage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      children: [
        {
          path: "lists/:id",
          name: "list",
          component: () => import("@/components/ListModal.vue"),
          props: true,
        },
      ],
    },
  ],
});

export default router;
