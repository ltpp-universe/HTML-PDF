/*
 * @Author: 18855190718 1491579574@qq.com
 * @Date: 2023-06-22 16:43:48
 * @LastEditors: 18855190718 1491579574@qq.com
 * @LastEditTime: 2023-06-22 18:52:06
 * @FilePath: \HTML转PDF\sqs-html-pdf.cpp
 * @Description: Email:1491579574@qq.com
 * QQ:1491579574
 * Copyright (c) 2023 by SQS, All Rights Reserved.
 */
#include <iostream>
#include <sys/stat.h>
#include <windows.h>

namespace TOOL
{
    class Console
    {
    public:
        Console();
        ~Console();
        static void log(std::string msg);
        static void error(std::string msg);
    };

    Console::Console()
    {
    }

    Console::~Console()
    {
    }

    inline void Console::log(std::string msg)
    {
        printf("\033[44m");
        printf(msg.c_str());
        printf("\033[0m");
        printf("\n");
    }

    inline void Console::error(std::string msg)
    {
        printf("\033[41m");
        printf(msg.c_str());
        printf("\033[0m");
        printf("\n");
    }
};

namespace CMD
{
    class install
    {
    private:
        std::string node_unzip_path = ".\\node-v18.16.1-win-x64";
        std::string node_zip_path = ".\\node-v18.16.1-win-x64.zip";

    public:
        install();
        ~install();
        void start();
    };

    class run
    {
    private:
        const std::string node_path = ".\\node-v18.16.1-win-x64\\node.exe main.js ";

    public:
        run();
        ~run();
        void start();
    };

    inline install::install()
    {
        const char *path = node_unzip_path.c_str();
        struct stat st;
        if (stat(path, &st) != 0 || !S_ISDIR(st.st_mode))
        {
            TOOL::Console::log("Installing Environment!");
            start();
            TOOL::Console::log("Install Environment Finished!");
        }
        else
        {
            TOOL::Console::log("Environment installed!");
        }
    }

    inline install::~install()
    {
    }

    inline void install::start()
    {
        try
        {
            system(("tar -xf " + node_zip_path).c_str());
        }
        catch (const std::exception &e)
        {
            TOOL::Console::error(e.what());
        }
    }

    run::run()
    {
    }

    run::~run()
    {
    }

    inline void run::start()
    {
        try
        {
            char buffer[MAX_PATH];
            GetCurrentDirectoryA(MAX_PATH, buffer);
            std::string current_path(buffer);
            system((node_path + current_path).c_str());
        }
        catch (const std::exception &e)
        {
            TOOL::Console::error(e.what());
        }
    }
}

int main()
{
    new CMD::install();
    CMD::run run;
    run.start();
    return 0;
}