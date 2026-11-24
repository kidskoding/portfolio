import { toggleHelp } from '../../lib/nvim-actions';
import { helpOpen } from '../../lib/nvim-store';

export default function Help() {
  return (
    <div
      id="nvim-help"
      class="nvim-help"
      hidden={!helpOpen()}
      role="dialog"
      aria-modal="true"
      aria-label="Key bindings"
    >
      <button
        class="nvim-help-backdrop"
        type="button"
        aria-label="Close key bindings"
        data-help-close
        onClick={() => toggleHelp(false)}
      />
      <div class="nvim-help-panel">
        <div class="nvim-help-title">:help keys</div>
        <dl>
          <dt>j / k, &darr; / &uarr;</dt>
          <dd>scroll</dd>
          <dt>ctrl+d / ctrl+u</dt>
          <dd>half page down / up</dd>
          <dt>gg / G</dt>
          <dd>top / bottom</dd>
          <dt>]b / [b</dt>
          <dd>next / previous buffer</dd>
          <dt>space e</dt>
          <dd>toggle explorer</dd>
          <dt>space space, space ff, ctrl+k</dt>
          <dd>telescope</dd>
          <dt>space bd</dt>
          <dd>close buffer</dd>
          <dt>:</dt>
          <dd>command line &mdash; tab completes; :q :e file :bn :bp :help :checkhealth :intro</dd>
          <dt>?</dt>
          <dd>this help</dd>
        </dl>
        <div class="nvim-help-sub">cards &amp; lists</div>
        <dl>
          <dt>h j k l</dt>
          <dd>move cursor between cards, enter opens</dd>
          <dt>gg / G</dt>
          <dd>first / last card</dd>
        </dl>
        <div class="nvim-help-sub">projects</div>
        <dl>
          <dt>1 2 3</dt>
          <dd>switch tab</dd>
          <dt>/</dt>
          <dd>filter tiles</dd>
          <dt>[[ / ]]</dt>
          <dd>previous / next project on a project page</dd>
        </dl>
        <div class="nvim-help-hint">everything works with the mouse too. esc closes this.</div>
      </div>
    </div>
  );
}
