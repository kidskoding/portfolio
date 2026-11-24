import { createSignal, For, onCleanup, onMount, type JSX } from 'solid-js';
import { devicons } from '../../data/devicons';
import type { Tab } from '../../lib/nvim-actions';
import { drawerOpen, isDrawer, openDrawer } from '../../lib/nvim-store';

interface Props {
  // top-level files under src/, then the blog index that heads blog-posts/
  files: Tab[];
  blogIndex: Tab;
  posts: string[];
  projects: string[];
  currentPath: string;
}

// Folder open state per session, like nvim-tree remembering expanded dirs
function useFolder(key: string, initial: boolean) {
  const [open, setOpen] = createSignal(initial);
  onMount(() => {
    const stored = sessionStorage.getItem(`tree:${key}`);
    if (stored !== null) setOpen(stored === 'true');
  });
  const toggle = () => {
    setOpen(!open());
    sessionStorage.setItem(`tree:${key}`, String(open()));
  };
  return [open, toggle] as const;
}

export default function Explorer(props: Props) {
  const [blogOpen, toggleBlog] = useFolder('blog-posts', true);
  const [projectsOpen, toggleProjects] = useFolder('projects', false);

  onMount(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && drawerOpen()) openDrawer(false);
    };
    document.addEventListener('keydown', onKeyDown);
    onCleanup(() => document.removeEventListener('keydown', onKeyDown));
  });

  // Picking a file in the drawer closes it, as the page underneath is what was asked for
  const closeDrawerOnPick = () => {
    if (isDrawer()) openDrawer(false);
  };

  const file = (path: string, label: string, icon: Tab['icon'], indent: number): JSX.Element => (
    <a
      href={path}
      class={`tree-file tree-indent-${indent}`}
      classList={{ 'tree-active': props.currentPath === path }}
      onClick={closeDrawerOnPick}
    >
      <span class={`tree-icon icon-${icon}`}>{devicons[icon]}</span>
      <span>{label}</span>
    </a>
  );

  const folderToggle = (key: string, label: string, open: () => boolean, toggle: () => void) => (
    <button
      class="tree-folder tree-indent-2"
      type="button"
      data-tree-toggle={key}
      aria-expanded={open() ? 'true' : 'false'}
      onClick={toggle}
    >
      <span class="tree-caret" aria-hidden="true">
        {open() ? 'v' : '>'}
      </span>
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <button
        class="nvimtree-backdrop"
        type="button"
        aria-label="Close file explorer"
        data-tree-drawer-close
        onClick={() => openDrawer(false)}
      />
      <nav class="nvimtree" id="nvimtree" aria-label="File explorer">
        <div class="nvimtree-body">
          <div class="tree-folder">
            <span class="tree-caret" aria-hidden="true">
              v
            </span>
            <span>portfolio</span>
          </div>
          {file('/package-json', 'package.json', 'json', 1)}
          <div class="tree-folder tree-indent-1">
            <span class="tree-caret" aria-hidden="true">
              v
            </span>
            <span>src</span>
          </div>
          <div>
            <For each={props.files}>{(buf) => file(buf.path, buf.file, buf.icon, 2)}</For>
            {folderToggle('blog-posts', 'blog-posts', blogOpen, toggleBlog)}
            <div data-tree-group="blog-posts" hidden={!blogOpen()}>
              {file(props.blogIndex.path, props.blogIndex.file, 'mdx', 3)}
              <For each={props.posts}>{(id) => file(`/blog/${id}`, `${id}.mdx`, 'mdx', 3)}</For>
            </div>
            {folderToggle('projects', 'projects', projectsOpen, toggleProjects)}
            <div data-tree-group="projects" hidden={!projectsOpen()}>
              <For each={props.projects}>{(id) => file(`/projects/${id}`, `${id}.mdx`, 'mdx', 3)}</For>
            </div>
            <div class="tree-folder tree-indent-2">
              &gt; <span>data</span>
            </div>
            <div class="tree-folder tree-indent-2">
              &gt; <span>components</span>
            </div>
            <div class="tree-folder tree-indent-2">
              &gt; <span>layouts</span>
            </div>
          </div>
          <div class="tree-folder tree-indent-1">
            &gt; <span>public</span>
          </div>
          <div class="tree-folder tree-indent-1">
            &gt; <span>node_modules</span>
          </div>
        </div>
      </nav>
    </>
  );
}
