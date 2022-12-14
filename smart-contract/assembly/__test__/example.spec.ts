import { event, setStorage } from "../main";
import { Address, Storage } from "@massalabs/massa-as-sdk";

describe("A group of test", () => {
    test("A test throwing an error", () => {
        event();
        const got = 42;
        const want = 41;
        if (got != want) {
            error(got.toString() + ", " + want.toString() + " was expected.");
            return;
        }
    });
});

describe("An other group of test", () => {
    test("Testing the Storage", () => {
        setStorage();
        assert(
            Storage.getOf(
                new Address(
                    "A12E6N5BFAdC2wyiBV6VJjqkWhpz1kLVp2XpbRdSnL1mKjCWT6oR"
                ),
                "test"
            ) == "value",
            "Test failed"
        );
    });
});
