#include <lo/lo.h>
#include <iostream>
#include <thread>  // Include this for std::this_thread::sleep_for
#include <chrono>  // Include this for std::chrono::seconds

// Callback function to handle incoming OSC messages
int osc_handler(const char *path, const char *types, lo_arg **argv, int argc,
                lo_message msg, void *user_data) {
    std::cout << "Received OSC message on path: " << path << std::endl;

    // Print arguments
    for (int i = 0; i < argc; ++i) {
        switch (types[i]) {
            case 'i': std::cout << "int: " << argv[i]->i << std::endl; break;
            case 'f': std::cout << "float: " << argv[i]->f << std::endl; break;
            case 's': std::cout << "string: " << &argv[i]->s << std::endl; break;
            default: std::cout << "Unknown type: " << types[i] << std::endl; break;
        }
    }

    return 0;
}

int main() {
    // Create an OSC server on port 7500
    lo_server_thread st = lo_server_thread_new("7500", nullptr);

    // Add a wildcard handler for all incoming messages
    lo_server_thread_add_method(st, NULL, NULL, osc_handler, NULL);

    // Start the server
    lo_server_thread_start(st);

    std::cout << "Listening for OSC messages on port 7500..." << std::endl;

    // Keep the program running
    while (true) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }

    lo_server_thread_free(st);
    return 0;
}
