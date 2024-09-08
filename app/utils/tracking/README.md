# Event Tracking Format

FORMAT EVENT: format page_category_action_label,

example: `report_period_changed` or `report_detail_tab_changed`

## Page

- `home`: The home page.
- `report`: The main report page.
- `report_detail`: A detailed view within the report.

* feel free for adding new pages

## Category

- `page`: The overarching category for page-related events.
- `element`: Specific elements on the page.
- `link`: Hyperlinks on the page.
- `button`: Clickable buttons.
- `form`: Form-related interactions.
- `image`: Images displayed on the page.
- `video`: Video elements.
- `audio`: Audio elements.
- `document`: Document-related interactions.
- `window`: Actions related to the browser window.

* feel free for adding new category

## Action

Common actions:

- `viewed`: Page or element viewed.
- `clicked`: Element or button clicked.
- `submitted`: Form submitted.
- `opened`: A window or section opened.
- `closed`: A window or section closed.
- `scrolled`: Scrolling action.
- `hovered`: Mouse hovered over an element.
- `focused`: Element gained focus.
- `blurred`: Element lost focus.
- `selected`: An option selected.
- `deselected`: A previously selected option deselected.
- `changed`: Generic change action.
- `interacted with`: General interaction with an element.

Form-related actions:

- `filled`: Form field filled.
- `edited`: Form field edited.
- `validated`: Form validation triggered.
- `cleared`: Form field cleared.
- `submitted_success`: Form submitted without errors.
- `submitted_error`: Form submitted with errors.

Media-related actions:

- `played`: Media played.
- `paused`: Media paused.
- `stopped`: Media stopped.
- `buffered`: Media buffering.
- `completed`: Media playback completed.

Other actions:

- `printed`: Document or page printed.
- `copied`: Content copied.
- `exported`: Data exported.
- `downloaded`: Data/File downloaded.

## Format Examples

- (home) page_viewed
- (report form) form_submitted
- (button) add_to_cart_clicked
- (video) video_played
- (search bar) search_submitted
- (document) document_downloaded
- (report_detail) page_viewed
- (audio) background_music_played
- (link) learn_more_clicked
- (image) product_image_clicked
- (hamburger menu) menu_opened
- (home period filter) filter_changed
- (page) page_scrolled
- (login form) form_focused
- (report_detail) image_clicked
- (video) video_paused
- (button) submit_form_clicked
- (home) page_viewed
- (image) image_hovered
- (menu) menu_closed
- (form) form_submitted_with_errors

Feel free to add a label for more specific details using the `label` field!

🏷️ **Label**: A specific description for additional details.
