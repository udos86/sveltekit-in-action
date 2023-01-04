<script>
    import { page } from '$app/stores';
  </script>
  
  <h1>Error</h1>

  <p>{$page.error?.message}</p>
  