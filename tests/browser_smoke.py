"""Real browser regression checks for the static portfolio."""
import http.server
import threading
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_args):
        pass


class BrowserSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = "http://127.0.0.1:" + str(cls.server.server_port)
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=3)

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 390, "height": 844})
        self.page = self.context.new_page()

    def tearDown(self):
        self.context.close()

    def test_navigation_and_language(self):
        self.page.goto(self.url + "/")
        self.page.get_by_role("heading", name="Arseniy Parakhin").wait_for()
        self.page.get_by_role("button", name="RU").click()
        self.assertEqual(self.page.locator("html").get_attribute("lang"), "ru")
        self.assertEqual(self.page.get_by_role("button", name="RU").get_attribute("aria-pressed"), "true")
        self.assertTrue(self.page.get_by_text("Из маленькой деревни в Алтае", exact=False).is_visible())
        self.page.get_by_role("link", name="История").click()
        self.page.get_by_role("heading", name="Моя история").wait_for()
        self.page.go_back()
        self.page.get_by_role("heading", name="Арсений Парахин").wait_for()
        self.assertTrue(self.page.get_by_role("link", name="ByMeVPN").is_visible())

    def test_no_js_still_displays_content(self):
        self.context.close()
        self.context = self.browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": 844})
        self.page = self.context.new_page()
        self.page.goto(self.url + "/")
        self.assertTrue(self.page.get_by_role("heading", name="Arseniy Parakhin").is_visible())
        self.page.get_by_role("link", name="Story").click()
        self.assertTrue(self.page.get_by_role("heading", name="My story").is_visible())

    def test_reduced_motion_and_small_screen(self):
        self.page.emulate_media(reduced_motion="reduce")
        self.page.set_viewport_size({"width": 320, "height": 640})
        self.page.goto(self.url + "/")
        self.assertTrue(self.page.get_by_role("heading", name="Arseniy Parakhin").is_visible())
        self.assertEqual(self.page.evaluate("document.documentElement.scrollWidth <= innerWidth"), True)
        self.assertEqual(
            self.page.locator(".reveal").first.evaluate("(el) => getComputedStyle(el).opacity"),
            "1",
        )

if __name__ == "__main__":
    unittest.main()
